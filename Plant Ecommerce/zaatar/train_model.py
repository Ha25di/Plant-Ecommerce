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

joblib.dump(RF, 'trained_model.pkl')
        