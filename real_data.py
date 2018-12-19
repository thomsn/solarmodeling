import csv
import pysolar.solar as solar
import datetime
import pytz
import json


def process_messing():
    PATH = "/Users/matt/Downloads/solar-generation-and-demand-italy-20152016/TimeSeries_TotalSolarGen_and_Load_IT_2016.csv"

    LAT = 42.6711769
    LONG = 12.4625580

    with open(PATH) as f, open('alt_az_pwr.csv','w+') as o:
        o.write('altitude,azimuth,power\n')
        first_line = True
        for line in csv.reader(f):
            if not first_line:
                t = datetime.datetime.strptime(line[0], '%Y-%m-%dT%H:%M:%SZ')
                args = [LAT, LONG, pytz.UTC.localize(t)]
                o.write('{},{},{}\n'.format(solar.get_altitude_fast(*args), solar.get_azimuth(*args), line[2]))
            else:
                first_line = False


def process_solar_lines():
    PATH = "/Users/matt/Downloads/solar-generation-and-demand-italy-20152016/TimeSeries_TotalSolarGen_and_Load_IT_2016.csv"

    LAT = 42.6711769
    LONG = 12.4625580

    result = [[]]

    with open(PATH) as f:
        first_line = True
        spot =  -1
        for line in csv.reader(f):
            if not first_line:
                t = datetime.datetime.strptime(line[0], '%Y-%m-%dT%H:%M:%SZ')

                args = [LAT, LONG, pytz.UTC.localize(t)]

                alt, az = solar.get_altitude_fast(*args), solar.get_azimuth(*args)

                if az < spot:
                    result.append([])

                result[-1].append({'altitude': alt, 'azimuth': az, 'power': line[2]})
                spot = az
            else:
                first_line = False

    json.dump(result, open('solar.json', 'w+'))

process_solar_lines()