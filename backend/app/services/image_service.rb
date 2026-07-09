# app/services/image_service.rb
class ImageService
  def self.extract_path(image)
    return nil if image.blank?

    image[:fileName]
  end
end