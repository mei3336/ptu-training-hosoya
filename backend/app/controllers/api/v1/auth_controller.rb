# app/controllers/api/v1/auth_controller.rb

class Api::V1::AuthController < ApplicationController
  def login
    user = User.find_by(email: params[:email])

    if user&.authenticate(params[:password])
      token = JWT.encode(
        {
          user_id: user.id,
          exp: 7.days.from_now.to_i
        },
        Rails.application.credentials.secret_key_base,
        "HS256"
      )

      cookies[:jwt] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax
      }

      render json: {
        result: "success",
        message: "Login successful",
        user: {
          id: user.id,
          email: user.email
        }
      }, status: :ok
    else
      render json: {
        error: "Invalid email or password"
      }, status: :unauthorized
    end
  end

  def logout
    cookies.delete(:jwt)

    render json: {
      result: "success",
      message: "Logged out"
    }
  end

  def me
    if session[:user_id].present?
      user = User.find_by(id: session[:user_id])

      if user
        render json: {
          authenticated: true,
          user: user
        }
      else
        render json: {
          authenticated: false
        }, status: :unauthorized
      end
    else
      render json: {
        authenticated: false
      }, status: :unauthorized
    end
  end

end
