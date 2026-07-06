class Api::V1::AuthController < ApplicationController
    
  def login
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])   //authenticateはhas_secure_passwordをモデルに記載したから自動で実装されたメソッド、ハッシュ化の要。
      session[:user_id] = user.user_id
      render json: { result: "success" }  //if(response.result === "success")見たいなフロントの条件分岐ができる。
    else
      render json: { result: "failed" }, status: :unauthorized
    end
  end

  def logout
    reset_session
    render json: { result: "success" }
  end

  def me
    user = User.find(session[:user_id])
    render json: { user: user }
  end

end
