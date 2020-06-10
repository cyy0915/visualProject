import flask
from flask import Flask

app = Flask(__name__)
dirpath = app.root_path
@app.route('/<path>')
def returnFile(path):
    if path!='owid-covid-data.csv':
        return flask.send_from_directory(dirpath, path)
    else:
        csvFile = open('owid-covid-data.csv', 'r')
        csvFile = csvFile.read()
        csvFile = csvFile.split('\n')
        for i in range(len(csvFile)):
            csvFile[i] = csvFile[i].split(',')
        csvFile[0].append('Case-Fatality_Ratio')
        for i in range(1,len(csvFile)):
            total = float(csvFile[i][3])
            death = float(csvFile[i][5])
            if total>100 and total>death:
                csvFile[i].append(str(death/total))
            else:
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
