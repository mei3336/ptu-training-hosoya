  Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      # 認証
      post "login",  to: "auth#login"
      post "logout", to: "auth#logout"
      get  "me",     to: "auth#me"

      # MFA
      post "mfa/setup",  to: "mfa#setup"
      post "mfa/verify", to: "mfa#verify"

      # ユーザー管理
      resources :users do
        patch :update_role, on: :member
        
        delete :withdraw, on: :collection
        delete :cancel_app_usage, on: :collection

      end

    end
  end
end