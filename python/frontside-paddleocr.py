import cv2
import numpy as np
import re
import sys
import json
from paddleocr import PaddleOCR
# import os
# os.environ['PADDLE_DISABLE_ONE_DNN'] = '1'
def enhance_for_ocr(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return None
    img = cv2.resize(img, None, fx=1.5, fy=1.5, interpolation=cv2.INTER_CUBIC)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    balanced = clahe.apply(gray)
    denoised = cv2.fastNlMeansDenoising(balanced, None, 10, 7, 21)
    return cv2.cvtColor(denoised, cv2.COLOR_GRAY2BGR)

image_path = sys.argv[1]

ocr = PaddleOCR(use_textline_orientation=True, lang='en')
clean_img = enhance_for_ocr(image_path)

extracted_data = {
    "Name": "Not Found",
    "Father Name": "Not Found",
    "Gender": "Not Found",
    "Country": "Not Found",
    "Identity Number": "Not Found",
    "Date of Birth": "Not Found",
    "Date of Issue": "Not Found",
    "Date of Expiry": "Not Found"
}

if clean_img is not None:
    result = ocr.predict(clean_img)
    if result:
        texts = [str(t).strip() for t in result[0]['rec_texts']]

        all_dates = [d for d in texts if re.search(r'\d{2}\.\d{2}\.\d{4}', d)]
        if len(all_dates) >= 3:
            sorted_dates = sorted(all_dates, key=lambda x: int(x.split('.')[-1]))
            extracted_data["Date of Birth"] = sorted_dates[0]
            extracted_data["Date of Issue"] = sorted_dates[1]
            extracted_data["Date of Expiry"] = sorted_dates[2]

        for i, t in enumerate(texts):
            text_upper = t.upper()

            if re.search(r'\d{5}-\d{7}-\d{1}', t):
                extracted_data["Identity Number"] = t

            elif text_upper == "NAME" and i + 1 < len(texts):
                extracted_data["Name"] = texts[i+1]

            elif "FATHER" in text_upper:
                for j in range(1, 4):
                    if i + j < len(texts):
                        candidate = texts[i+j]
                        if re.search('[a-zA-Z]', candidate) and not re.search(r'\d', candidate):
                            extracted_data["Father Name"] = candidate
                            break

            if re.search(r'\bF\b', text_upper):
                extracted_data["Gender"] = "Female"
            elif re.search(r'\bM\b', text_upper):
                extracted_data["Gender"] = "Male"

            if "PAKISTAN" in text_upper:
                extracted_data["Country"] = "Pakistan"

print(json.dumps(extracted_data))
