import cv2
import numpy as np

# Open image
image = cv2.imread("./fishes/test2.jpg")
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
blur = cv2.GaussianBlur(gray, (55, 55), 0)
_, thresh = cv2.threshold(blur, 127, 255, cv2.THRESH_BINARY_INV)
edge = cv2.Canny(blur, 5, 10)

k = np.ones((15, 15), np.uint8) 
dilated = cv2.dilate(edge, k, 1)  

# contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
contours, hierarchy = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

max = 0
max_index = 0
for index, c in enumerate(contours):
    if(cv2.contourArea(c) > max):
        max_index = index
        max = cv2.contourArea(c)

print(max)

mask = np.zeros_like(image)
# cv2.drawContours(mask, contours, -1, (255, 255, 255), cv2.FILLED)
cv2.fillPoly(mask, pts =[contours[max_index]], color=(255,255,255))

mask_thresh = cv2.cvtColor(mask, cv2.COLOR_BGR2GRAY)
transparent = cv2.cvtColor(image, cv2.COLOR_BGR2BGRA)
transparent[:, :, 3] = mask_thresh

x, y, w, h = cv2.boundingRect(contours[max_index])
cropped_image = transparent[y:y+h, x:x+w]

aspect_ratio = w/h

if(aspect_ratio > 1):
    scaling_interpolation = cv2.INTER_AREA if w > 500 else cv2.INTER_CUBIC
    resize_image = cv2.resize(cropped_image, (500, round(500/aspect_ratio)), interpolation = cv2.INTER_AREA)
else:
    scaling_interpolation = cv2.INTER_AREA if h > 200 else cv2.INTER_CUBIC
    resize_image = cv2.resize(cropped_image, (round(250 * aspect_ratio), 250), interpolation = cv2.INTER_AREA)


# cv2.imshow("image", gray)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

cv2.imwrite("output.png", resize_image)