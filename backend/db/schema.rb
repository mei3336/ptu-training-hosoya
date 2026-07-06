# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_03_084831) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "users", primary_key: "user_id", force: :cascade do |t|
    t.string "bio", limit: 200
    t.datetime "created_at", null: false
    t.string "email", limit: 255, null: false
    t.string "icon_image", limit: 255
    t.datetime "locked_at"
    t.integer "login_failure_count", default: 0, null: false
    t.string "name", limit: 50, null: false
    t.string "nickname", limit: 15
    t.string "otp_secret_key"
    t.string "password_digest", null: false
    t.integer "role", default: 2, null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end
end
