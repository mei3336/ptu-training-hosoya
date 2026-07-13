# app/controllers/api/v1/auth_controller.rb

class Api::V1::AuthController < ApplicationController
  before_action :authenticate_user!, only: [:me]

  def login
    user = User.find_by(email: params[:email])

    if user&.locked?
      return render json: {
        errors: {
          login: [
            I18n.t("errors.messages.account_locked")
          ]
        }
      }, status: :locked
    end

    if user&.authenticate(params[:password])
      if user.mfa_enabled?
        return render json: {
          result: "mfa_required",
          user_id: user.id
        }, status: :ok
      end

      user.reset_login_failure_count!
      issue_jwt_cookie(user)

      render json: {
        result: "success",
        message: "ログインに成功しました",
        user: {
          id: user.id,
          role: user.role,
          name: user.name,
          email: user.email
        }
      }, status: :ok
    else
      user&.register_login_failure!

      render json: {
        errors: {
          login: [
            I18n.t("errors.messages.invalid_login")
          ]
        }
      }, status: :unauthorized
    end
    return
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
