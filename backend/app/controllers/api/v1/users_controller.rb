class Api::V1::UsersController < ApplicationController
    include Rails.application.routes.url_helpers
    before_action :require_admin, only: [:destroy, :update_role] #あとで、どこが管理者権限？一般開放？をもう一回確かめながら実装。 

   def index
     @users = User.order(updated_at: :desc)

     render json: @users.map { |user|
        {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            bio: user.bio,
            nickname: user.nickname,
            icon_image_url:
            user.icon_image.attached? ?
                rails_blob_url(
                user.icon_image,
                host: "localhost",
                port: 3000
                ) :
                nil
         }
        }
   end

    def show
        @user = User.find(params[:id])
        render json: @user
    end

    def create
        @user = User.new(user_params.except(:icon_image))

        if @user.save
            @user.icon_image.attach(params[:user][:icon_image]) if params[:user][:icon_image].present?

            render json: {
            id: @user.id,
            name: @user.name
            }, status: :created
        else
            render json: @user.errors.full_messages,
                status: :unprocessable_entity
        end
    end

    
    def update
        @user = User.find(params[:id])

        if @user.update(user_params.except(:icon_image))
            if params[:user][:icon_image].present?
            @user.icon_image.attach(params[:user][:icon_image])
            end

            render json: @user
        else
            render json: @user.errors,
                status: :unprocessable_entity
    end

    end

    def destroy
        @user = User.find(params[:id])
        @user.destroy
        head :no_content
    end

    def update_role
        @user = User.find(params[:id])
        if @user.update(params.require(:user).permit(:role))
            render json: @user
        else
            render json: @user.errors, status: :unprocessable_entity
        end
    end


    def withdraw
        user = current_user

        admin_count = User.where(role: "admin").count

        if user.role == "admin" && admin_count <= 1
        return render json: {
            error: "最後の管理者は退会できません"
        }, status: :conflict
        end

        user.destroy!

        head :no_content
    end
    
    def cancel_app_usage
        admin_count = User.where(role: "admin").count

        if admin_count > 1
            return render json: {
            error: "他の管理者が存在するため実行できません"
            }, status: :conflict
        end

        User.destroy_all

        head :no_content
    end


    private

    def user_params
        params.require(:user).permit(
            :name,
            :nickname,
            :email,
            :bio,
            :password,
            :role,
        )
    end

    def require_admin
        unless current_user.admin?
            render json: { error: "権限がありません" }, status: :forbidden
        end
    end
end
