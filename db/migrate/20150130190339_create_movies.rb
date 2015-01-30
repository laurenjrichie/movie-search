class CreateMovies < ActiveRecord::Migration
  def change
    create_table :movies do |t|
      t.string :title
      t.integer :year
      t.string :plot
      t.string :image_url
      t.boolean :favorite
      t.integer :rating
      
      t.timestamps
    end
  end
end
