# **Smart Livestock Management for Rural Prosperity**

**Smart Livestock Management for Rural Prosperity** is an AI-powered, web-based intelligent system designed to bridge the gap between modern digital technology and traditional dairy farming. Developed as a **Major Project** at the **Guru Nanak Institute of Technology**, this platform leverages **Machine Learning (ML)** and **Image Processing** to help farmers identify cattle breeds and manage livestock health with data-driven insights.

---

## **Key Features**

*   **AI-Powered Breed Identification:** Uses a **Convolutional Neural Network (CNN)** to accurately classify indigenous and exotic cattle and buffalo breeds from uploaded images.
*   **Intelligent Image Preprocessing:** Implements resizing, normalization, and noise reduction to ensure high prediction accuracy even in varied field conditions.
*   **Comprehensive Breed Repository:** Provides detailed metadata for identified breeds, including average milk yield, fat percentage, lactation periods, and feeding practices.
*   **Digital Cattle Profiles:** Maintains a centralized record for each animal using a unique 10-character ID, storing health history, breeding data, and ownership details.
*   **Health & Vaccination Monitoring:** Generates automated reminders and schedules for vaccinations and health check-ups based on breed-specific needs.
*   **Multilingual & Accessible UI:** Supports multiple Indian regional languages and integrates **voice-based assistance** (text-to-speech) to ensure usability for farmers with limited literacy.
*   **Real-time Analytics:** Offers confidence scores for predictions and tracks herd distribution and usage trends for better decision-making.

---

## **Technology Stack**

### **Frontend**
*   **React.js:** For a responsive and dynamic user interface.
*   **Tailwind CSS:** For utility-first styling and mobile-responsive design.
*   **i18next:** To manage multilingual support for regional languages.
*   **Web Speech API:** To provide voice assistance and audio feedback.

### **Backend**
*   **Node.js & Express.js:** Handles RESTful APIs, authentication, and server-side logic.
*   **Python (Flask):** Dedicated server for serving the trained CNN model and processing image inferences.
*   **JWT (JSON Web Tokens):** For secure user authentication.
*   **Bcrypt.js:** For secure password hashing.

### **Database**
*   **MongoDB Atlas:** A cloud-based NoSQL database used to store flexible documents like breed characteristics and animal health records.

### **Machine Learning / AI**
*   **Convolutional Neural Networks (CNN):** The core architecture for visual feature extraction and breed classification.
*   **Keras:** Used for training, validating, and deploying the deep learning models.
*   **OpenCV:** Utilized for image preprocessing tasks like resizing and normalization.

---

## **System Workflow**

1.  **Image Acquisition:** The user uploads or captures a cattle image via the web interface.
2.  **Validation & Preprocessing:** The system verifies the image format and standardizes it for the model.
3.  **CNN Inference:** The trained model extracts features to predict the breed and provides a confidence score.
4.  **Data Retrieval:** The system fetches breed-specific health and management guidelines from MongoDB.
5.  **Result Presentation:** A detailed report is displayed, and the result is logged for historical tracking.
6.  **Registration Check:** The system verifies the animal's unique ID to update an existing profile or register a new one.

---

## **Project Team**
*   **Satyajit Roy** (University Roll No: 501022010020)
*   **Soubhik Dey** (University Roll No: 501022010021)
*   **Puskar Mal** (University Roll No: 501022010014)
*   **Sounak Dey** (University Roll No: 501022010023)
*   **Sujit Mondal** (University Roll No: 501022010026)
*   **Guided By:** Prof. Suparna Maity, Dept. of ECS, GNIT

---

## **Future Scopes**
The system is designed for modular expansion, including the integration of **IoT wearable sensors** for real-time health monitoring, **disease outbreak prediction alerts**, and synchronization with **national livestock databases**.
