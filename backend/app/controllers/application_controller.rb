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

    @current_user ||= User.find_by(id: payload["user_id"])
  rescue JWT::DecodeError, JWT::ExpiredSignature
    Rails.logger.info "JWT Error: #{e.message}"
    nil
  end

  def authenticate_user!
    return if current_user

    render json: { error: "Unauthorized" }, status: :unauthorized
  end
end
