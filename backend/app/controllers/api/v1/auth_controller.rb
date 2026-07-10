# app/controllers/api/v1/auth_controller.rb

class Api::V1::AuthController < ApplicationController
  before_action :authenticate_user!, only: [:me]

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
      Rails.logger.info "COOKIE=#{cookies[:jwt]}"
      Rails.logger.info response.headers.to_h.inspect

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
    render json: {
      user: current_user,
      icon_image_url: current_user.icon_image.attached? ?
      url_for(current_user.icon_image) : nil
    }

  end
end
