
export interface Product {
  id: number
  name: string
  category: string
  main_image_url: string
  secondary_image_url: string
  title: string
  about: string[]
  ingredients: string
  nutrition_facts: string[]
  price: number
  in_stock: boolean
}

export interface ProductResponse {
  products: Product[]
}