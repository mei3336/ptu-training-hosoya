class Api::V1::UsersController < ApplicationController
    before_action :require_admin, only: [:index, :destroy, :update_role] //あとで、どこが管理者権限？一般開放？をもう一回確かめながら実装。 

    def index
        @users = User.all
        render json: @users
    end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create
        @user = User.new(user_params)
        if @user.save
            render json: @user, status: :created
        else
            render json: @user.errors, status: :unprocessable_entity
        end
    end

    def update
        @user = User.find(params[:id])
        if @user.update(user_params)
            render json: @user
        else
            render json: @user.errors, status: :unprocessable_entity
        end
    end

    def destroy
        @user = User.find(params[:id])
        @user.destroy
        head :no_content
    end

    private

    def user_params
        params.require(:user).permit(:name, :email, :password)
    end

    def def require_admin
        unless current_user.admin?
            render json: { error: "権限がありません" }, status: :forbidden
        end
    end
end
