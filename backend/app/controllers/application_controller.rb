class ApplicationController < ActionController::API
  include ActionController::Cookies
  
  private

  def current_user
    token = cookies[:jwt]
    Rails.logger.info "JWT Cookie: #{token.inspect}"
    return nil unless token

    decoded = JWT.decode(
      token,
      Rails.application.credentials.secret_key_base,
      true,
      algorithm: "HS256"
    )

    payload = decoded.first

    @current_user ||= User.find_by(user_id: payload["user_id"])
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    Rails.logger.info "JWT Error: #{e.message}"
    nil
  end

  def authenticate_user!
    return if current_user

    render json: { error: "Unauthorized" }, status: :unauthorized
  end

  def issue_jwt_cookie(user)
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
  end
end
