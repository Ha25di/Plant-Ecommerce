import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

crop = pd.read_csv("datasets/Crop_recommendation.csv")

    # remove duplicate values
crop = crop.drop_duplicates()

    # handle null values in dataset
attr=["N","P","K","temperature","humidity","ph", "rainfall","label"]
if crop.isna().any().sum() !=0:
        for i in range(len(attr)):
            crop[attr[i]].fillna(0.0, inplace = True)

    #Remove unwanted parts from strings in a column 
crop.columns = crop.columns.str.replace(' ', '') 

    # we have given 7 features to the algorithm
features = crop[['N', 'P','K','temperature', 'humidity', 'ph', 'rainfall']]

    # dependent variable is crop
target = crop['label']

    # our model will contain training and testing data
x_train, x_test, y_train, y_test = train_test_split(features,target,test_size = 0.2,random_state =2)
    
    # here n_estimators is The number of trees in the forest.
    # random_state is for controlling  the randomness of the bootstrapping
RF = RandomForestClassifier(n_estimators=20, random_state=0)

    # we'll use rf.fit to build a forest of trees from the training set (X, y).
RF.fit(x_train,y_train)

joblib.dump(RF, 'trained_RF_model.pkl')




# For fertilizer model


import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load the dataset
file_path = 'datasets/Fertilizer_Prediction.csv'  # Replace with your file path
data = pd.read_csv(file_path)

# Encoding categorical variables
label_encoders = {}
for column in ['Soil Type', 'Crop Type']:
    label_encoders[column] = LabelEncoder()
    data[column] = label_encoders[column].fit_transform(data[column])
    
# Save the LabelEncoder objects
for col, encoder in label_encoders.items():
    joblib.dump(encoder, f'trained_{col}_encoder.pkl')

# Splitting the dataset into training and testing sets
X = data.drop('Fertilizer Name', axis=1)
y = data['Fertilizer Name']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create Logistic Regression model
log_reg = LogisticRegression(max_iter = 14)

# Train the model
log_reg.fit(X_train, y_train)

joblib.dump(log_reg, 'trained_LR_model.pkl')

# Predict on the test set
#log_reg_pred = log_reg.predict(X_test)

# Calculate accuracy
#log_reg_acc = accuracy_score(y_test, log_reg_pred)

# Print the accuracy
#print(f'Accuracy of Logistic Regression model: {log_reg_acc}')
        