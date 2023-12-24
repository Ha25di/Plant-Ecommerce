import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

crop = pd.read_csv("datasets/Crop_recommendation.csv")
crop = crop.drop_duplicates()
attr=["N","P","K","temperature","humidity","ph", "rainfall","label"]
if crop.isna().any().sum() !=0:
        for i in range(len(attr)):
            crop[attr[i]].fillna(0.0, inplace = True)
crop.columns = crop.columns.str.replace(' ', '') 
features = crop[['N', 'P','K','temperature', 'humidity', 'ph', 'rainfall']]
target = crop['label']
x_train, x_test, y_train, y_test = train_test_split(features,target,test_size = 0.2,random_state =2)
RF = RandomForestClassifier(n_estimators=20, random_state=0)
RF.fit(x_train,y_train)

joblib.dump(RF, 'trained_RF_model.pkl')




# For fertilizer model


import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


file_path = 'datasets/Fertilizer_Prediction.csv'  
data = pd.read_csv(file_path)
# Encoding categorical variables
label_encoders = {}
for column in ['Soil Type', 'Crop Type']:
    label_encoders[column] = LabelEncoder()
    data[column] = label_encoders[column].fit_transform(data[column])
    
# Save the LabelEncoder objects
for col, encoder in label_encoders.items():
    joblib.dump(encoder, f'trained_{col}_encoder.pkl')

X = data.drop('Fertilizer Name', axis=1)
y = data['Fertilizer Name']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

log_reg = LogisticRegression(max_iter = 14)
log_reg.fit(X_train, y_train)
joblib.dump(log_reg, 'trained_LR_model.pkl')


        