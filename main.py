import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import date
from scipy.optimize import curve_fit


def exponential(x, a, k, b):
    return a*np.exp(x*k) + b


def linear_func(x, a, b):
    return a*x + b


def new_csv():
    de = pd.read_csv("new.csv")
    return de


def plot_model(df, country, min_infections,
               start_exponential_phase, end_exponential_phase,
               start_linear_phase, end_linear_phase):
    # filter just one country
    df = df[df["location"] == country]
    df = df.drop(columns=["location"])
    date_list = df["date"].tolist()
    cases_list = df["total_cases"].tolist()
    d = {date_list[0]: cases_list[0]}
    for i in range(len(cases_list)):
        d[date_list[i]]= cases_list[i]
    dg = pd.DataFrame(d,index = [0])

    dg = dg.iloc[0]  # convert to pd.Series
    # start with first infections
    dg = dg[dg.values > min_infections]

    # parse to datetime
    dg.index = pd.to_datetime(dg.index, format='%Y/%m/%d')
    print(dg.index)
    # fit to exponential function
    duration_exponential_phase = end_exponential_phase - start_exponential_phase
    days_exponential_phase = np.arange(duration_exponential_phase) + start_exponential_phase
    poptimal_exponential, pcovariance_exponential = curve_fit(
        exponential, days_exponential_phase, dg.values[start_exponential_phase:end_exponential_phase], p0=[1, 0.35, 0]
    )

    # compute exponential prediction
    prediction_in_days = 10
    time_in_days_extra = np.arange(
        start=start_exponential_phase, stop=duration_exponential_phase+prediction_in_days
    )
    prediction = exponential(time_in_days_extra, *poptimal_exponential).astype(int)
    dg_prediction_exponential = pd.Series(prediction)

    # convert index to dates
    dg_prediction_exponential.index = pd.date_range(
        start=dg.index[start_exponential_phase],
        periods=duration_exponential_phase + prediction_in_days,
        closed="left"
    )

    # fit to linear function
    duration_linear_phase = end_linear_phase - start_linear_phase
    days_linear_phase = np.arange(duration_linear_phase) + start_linear_phase
    poptimal_linear, pcovariance_linear = curve_fit(
        linear_func, days_linear_phase, dg.values[start_linear_phase:end_linear_phase], p0=[1, 1]
    )

    # compute linear prediction
    prediction_in_days = 20
    time_in_days_extra = np.arange(
        start=start_linear_phase, stop=end_linear_phase+prediction_in_days
    )
    prediction_linear = linear_func(time_in_days_extra, *poptimal_linear).astype(int)
    dg_prediction_linear = pd.Series(prediction_linear)

    # convert index to dates
    dg_prediction_linear.index = pd.date_range(
        start=dg.index[start_linear_phase],
        periods=duration_linear_phase + prediction_in_days,
        closed="left"
    )


    fig, ax = plt.subplots(figsize=(15, 10))
    # plot real data
    ax.plot(
        dg.index,
        dg.values,
        '*',
        color="blue",
        markersize=5,
        label=f"Infections in {country}")
    # plot exponential phase
    ax.plot(
         dg.index[start_exponential_phase:end_exponential_phase],
         exponential(days_exponential_phase, *poptimal_exponential),
         'g-',
         linewidth=2,
         label="Exponential Phase"
    )
    # plot exponential prediction
    ax.plot(
        dg_prediction_exponential.index[duration_exponential_phase:],
        dg_prediction_exponential.values[duration_exponential_phase:],
        'r--',
        label="Exponential Phase Prediction"
    )
    # plot linear phase
    ax.plot(
        dg.index[start_linear_phase:end_linear_phase],
        linear_func(days_linear_phase, *poptimal_linear),
        'm-',
        linewidth=2,
        label="Linear Phase"
    )
    # plot linear prediction
    ax.plot(
        dg_prediction_linear.index[duration_linear_phase:],
        dg_prediction_linear.values[duration_linear_phase:],
        'm--',
        label="Linear Phase Prediction"
    )
    ax.set_xlabel("Date")
    ax.set_ylabel("Number of Infections")
    ax.legend()
    ax.grid()
    ax.xaxis.set_major_locator(mdates.DayLocator(interval=2))
    fig.suptitle(f"{date.today()} - Number of Infected persons in {country}")
    fig.autofmt_xdate()
    fig.savefig(f"plots/model_{country}.png", bbox_inches='tight')


if __name__ == '__main__':

    if not os.path.isdir("plots"):
        os.mkdir("plots")

    de = new_csv()
    country = input("input country:")
    exp_start = int(input("input exp_start:"))
    exp_end = int(input("input exp_end:"))
    line_start = int(input("input line_start:"))
    line_end = int(input("input line_end:"))
    plot_model(de, country, 0, exp_start, exp_end, line_start, line_end)
