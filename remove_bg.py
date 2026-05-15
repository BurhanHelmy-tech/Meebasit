from rembg import remove
from PIL import Image

input_path = 'A_vector_logo_illustration_of_202605160005.jpeg'
output_path = 'logo.png'

try:
    with open(input_path, 'rb') as i:
        input_data = i.read()
    output_data = remove(input_data)
    with open(output_path, 'wb') as o:
        o.write(output_data)
    print("Background removed successfully.")
except Exception as e:
    print(f"Error: {e}")
