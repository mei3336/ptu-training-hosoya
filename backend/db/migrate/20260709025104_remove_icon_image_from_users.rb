class RemoveIconImageFromUsers < ActiveRecord::Migration[8.1]
  def change
    remove_column :users, :icon_image, :string
  end
end
