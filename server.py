import flask
from flask import Flask
import urllib.request as request
import os
import predict
import pandas as pd

app = Flask(__name__)
dirpath = app.root_path

@app.route('/predict/<country>/<middle>/<end>')
def returnPredict(country, middle, end):
    middle = int(middle)
    end = int(end)
    de = pd.read_csv("owid-covid-data.csv")
    predict.plot_model(de, country, 0, 0,middle , middle+1, end)
    return flask.send_from_directory(os.path.join(dirpath, 'plots'), "model_%s.png" % country)

@app.route('/pic/<path>')
def returnPic(path):
    return flask.send_from_directory(os.path.join(dirpath, 'pic'), path)
@app.route('/plots/<path>/<rand>')
def returnPlot(path, rand):
    return flask.send_from_directory(os.path.join(dirpath, 'plots'), path)
@app.route('/<path>')
def returnFile(path):
    if path!='owid-covid-data.csv':
        return flask.send_from_directory(dirpath, path)
    else:
        url = 'https://covid.ourworldindata.org/data/owid-covid-data.csv'
        request.urlretrieve(url, 'owid-covid-data.csv')
        csvFile = open('owid-covid-data.csv', 'r')
        csvFile = csvFile.read()
        csvFile = csvFile.split('\n')
        for i in range(len(csvFile)):
            csvFile[i] = csvFile[i].split(',')
            if len(csvFile[i])>=2:
                del csvFile[i][1]
        for i in range(len(csvFile)):
            if len(csvFile[i])<2:
                del csvFile[i]
        csvFile[0].append('Case-Fatality_Ratio')
        for i in range(1,len(csvFile)):
            try:
                total = float(csvFile[i][3])
                death = float(csvFile[i][5])
                if total>100 and total>death:
                    csvFile[i].append(str(death/total))
                else:
                    csvFile[i].append('0')
            except:
                csvFile[i].append('0')
            
        data = ''
        for i in csvFile:
            for j in i:
                data+=j+','
            data+='\n'
        return data
        

@app.route('/')
def main():
    return flask.send_from_directory(dirpath, 'main.html')
