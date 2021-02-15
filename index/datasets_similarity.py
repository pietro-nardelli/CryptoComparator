import json
import csv
import random

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import manifold
from sklearn import preprocessing

import numpy as np
from numpy import linalg

def preprocess_and_save_Data(keyword,dateFormat=False,save=True):
    import pandas as pd
    from datetime import datetime

    # keyword = 'Bitcoin'
    path = 'dataset/'+str(keyword)+'.csv'

    dataset = pd.read_csv(path)


    for i,elem in enumerate(dataset['Market Cap']):
        if elem =='-':
            elem = '0'
        arr = elem.split(",")
        final_num = ''
        for num in arr:
            final_num += num
        dataset['Market Cap'][i] = int(final_num)

    for i,elem in enumerate(dataset['Volume']):
        if elem =='-':
            elem = '0'
        arr = elem.split(",")
        final_num = ''
        for num in arr:
            final_num += num
        dataset['Volume'][i] = int(final_num)


    months = {'Jan':[0,1] , 'Feb':[0,2], 'Mar': [0,3], 'Apr': [0,4], 'May': [0,5], 'Jun': [0,6], 'Jul': [0,7], 'Aug': [0,8], 'Sep': [0,9], 'Oct': 10, 'Nov': 11, 'Dec': 12}


    fin_arr = []


    for i,elem in enumerate(dataset['Date']):
        if(elem=='42093'):
            elem = 'Mar 31, 2015'
        temp_date = elem.split(' ')
        temp_date[1] = temp_date[1].split(',')[0]
        if(temp_date[0]=='June'):
            temp_date[0] = 'Jun'
        if(temp_date[0]=='April'):
            temp_date[0]='Apr'
        if(temp_date[0]=='December'):
            temp_date[0]='Dec'
        if(temp_date[0] == 'November'):
            temp_date[0]='Nov'
        if(temp_date[0]=='October' ):
            temp_date[0]='Oct'

        temp_date[0] = months[temp_date[0]]
        if(type(temp_date[0])==list ):
            final_date = int(str(temp_date[2])+'0'+str(temp_date[0][1])+str(temp_date[1]))
        else:
            final_date = int(str(temp_date[2])+str(temp_date[0])+str(temp_date[1]))
        if(dateFormat):
            datetimeobject = datetime.strptime(str(final_date),'%Y%m%d')
            newformat = datetime.strftime(datetimeobject,'%m-%d-%Y') # 07-16-2014
            dataset['Date'][i] =newformat
        else:
            dataset['Date'][i] = final_date
    if(save):
        dataset.to_csv(keyword+'_preprocessed'+'.csv', index=False)
    return dataset

'''
Import data from file and store into dictionary. The dataset should be cleaned from all the special characters and characters in order to
produce only numerical values.
Input:
    path: the path to the top_100.csv file
Output:
    dictionary: partially full dictionary that contains each node and its values from the top_100 dataset e.g.
                {"nodes": [{"#": ..., "Name": ..., "Market Cap": ..., "Price": ..., "Circulating Supply": ..., "Volume (24h)": ..., "% Change (24h)":... },
                            {#": ..., ...},

'''

def import_data (path:str):
    with open(path, newline='') as csvfile:
        top_100 = csv.reader(csvfile, delimiter=',')
        # ['#', 'Name', 'Market Cap', 'Price', 'Circulating Supply', 'Volume (24h)', '% Change (24h)']
        csv_headings = next(top_100)

        dictionary = {} # {}
        dictionary ['nodes'] = [] #  { [] }
        for row in top_100:
            temp_dict = {}
            for i in range(len(csv_headings)):
                temp_dict[csv_headings[i]] = row[i]
                # From Market Cap, clear special characters
                if (i > 1):
                    temp = row[i].replace('$','').replace(',','').replace('%','')
                    # If Circulating Supply, remove coin abbreviation
                    if (i == 4):
                        temp = temp.split()[0]
                    # If change (24h), divide by 100 because it's a % value
                    elif (i == 6):
                        temp = float(temp)/100

                    temp_dict[csv_headings[i]] = temp
            # {"#": "1", "Name": "Bitcoin", "Market Cap": "60219183594", "Price": "3631.72", "Circulating Supply": "16581450", "Volume (24h)": "1226800000", "% Change (24h)": "-0.84"}
            dictionary['nodes'].append(temp_dict)
    return dictionary


# Preprocess data and compute MDS
def mds_computation (dictionary):
    standard_input_list = []
    nodes_id = []

    for node in dictionary['nodes']:
        nodes_id.append(node['#'])

        node_values = []

        node_values.append(node['Market Cap'])
        node_values.append(node['Price'])
        node_values.append(node['Circulating Supply'])
        node_values.append(node['Volume (24h)'])
        node_values.append(node['% Change (24h)'])

        standard_input_list.append(node_values)

    #data standardization
    std_scale = preprocessing.StandardScaler().fit(standard_input_list)
    standard_input_list= std_scale.transform(standard_input_list)

    mds = manifold.MDS(n_components=2, dissimilarity="euclidean",random_state=2)
    pos = mds.fit(standard_input_list).embedding_

    return nodes_id,pos,standard_input_list

def plot_mds(nodes_id, pos):
    # Scatter plot without labels
    plt.scatter(pos[:, 0], pos[:, 1], color='red',s=10, lw=0, label='Crypto ')
    plt.legend(scatterpoints=1, loc='best', shadow=False)
    plt.show()

    # Scatter plot with labels: each label is the identifier of the cryptocurrency
    for label, x, y in zip(nodes_id[:], pos[:, 0], pos[:, 1]):

        plt.annotate(
            label,
            xy = (x, y), xytext = (7, -5),
            textcoords = 'offset points', ha = 'right', va = 'bottom',
            bbox = dict(boxstyle = 'round,pad=0.1', fc = 'red', alpha = 0.5))
    plt.show()

'''
Input:
    pos:          positions in 2-Dim space from MDS
    standard_input_list: standardized input values for MDS computation
    final_dict: dictionary produced from "import_data" that contains only (for now) nodes[{#:..., Name:..., MarketCap: ..., }]
    dim_red_flag: dimensionality reduction flag, if True compute distance with MDS otherwise simple Euclidean compute_distance
Output:
    final_dict: the final dictionary with nodes[{#:..., Name:..., MarketCap: ..., }] and links[{source:..., target:..., value:...}]
'''
def compute_distance(pos, standard_input_list, final_dict, dim_red_flag):
    final_dict['links'] = []
    max = 0
    # Compute distance with MDS
    if (dim_red_flag):
        for i in range(len(pos)):
            v_i = pos[i]
            for j in range(i, len(pos)):
                v_j = pos[j]
                val = np.linalg.norm(v_i - v_j)
                # Compute max value for normalization
                if (max < val):
                    max = val
                final_dict['links'].append( {"source": i, "target": j, "value": val} )
        # Normalization w.r.t. max
        for link in final_dict['links']:
            link['value'] = link['value']/max

    # Compute simple Euclidean distance
    else:
        max = 0
        for i in range(len(standard_input_list)):
            v_i = standard_input_list[i]
            for j in range(i, len(standard_input_list)):
                v_j = standard_input_list[j]
                min_nums = min(len(v_i),len(v_j))
                val = np.linalg.norm(np.asarray(v_i[:min_nums]) - np.asarray(v_j[:min_nums]))
                if (max < val):
                    max = val

                final_dict['links'].append( {"source": i, "target": j, "value": val} )
        # Normalization w.r.t. max
        for link in final_dict['links']:
            link['value'] = 1-link['value']/max

    return final_dict

'''
PER MATTEO!

***
Lascia invariato
***
final_dict = import_data ('dataset/100List.csv')


******************************
- Sono tante standard_input_list quante sono le colonne dei dataset (volume, market cap, ...)
- La lunghezza di ogni sotto lista è pari alla lunghezza della relativa time series.
- Bitcoin è la prima lista, Ethereum è la seconda lista, Ethereum cash è la terza lista ecc... (ordinamento top 100)
- Per sapere quale è l'ordine corretto basta iterare:
    for node in final_dict['nodes']:
        node['#'] e node['Name'] conterranno rispettivamente la posizione della criptovaluta e il suo nome
********************
standard_input_list = ...


***
Tanto a te non serve quindi ti basta inizializzarlo
****
pos = 0

***
Da modificare solamente la lunghezza dei singoli array v_i, v_j se uno dei due è più lungo dell'altro
***
final_dict = compute_distance(pos, standard_input_list, final_dict, dim_red_flag=False)

***
Con la struttura dati "final_dict" che hai creato ti basta generare tanti file .json quanti sono le colonne dei dataset (volume, market cap, ...)
Ad esempio:
***
with open('market_cap.json', 'w') as f:
    json.dump(final_dict_market_cap,f)

'''
final_dict = import_data ('dataset/100List.csv')

'''
datasets = []
for node in final_dict['nodes']:
    print (node['Name'])
    datasets.append(preprocess_and_save_Data(node['Name'],dateFormat=True,save=False))
'''

# ESEMPIO:
volume_standard_input_list=[]
market_standard_input_list=[]
high_standard_input_list=[]
low_standard_input_list=[]
open_standard_input_list=[]
close_standard_input_list=[]
list_of_lists = []

cryptonames = ["Bitcoin", "Ethereum", "Bitcoin Cash", "Ripple", "Dash", "Litecoin", "NEM", "IOTA", "Monero", "Ethereum Classic", "NEO", "BitConnect", "Lisk", "Zcash", "Stratis", "Waves", "Ark","Steem", "Bytecoin", "Decred", "BitShares", "Stellar Lumens", "Hshare", "Komodo", "PIVX", "Factom", "Byteball Bytes", "Nexus", "Siacoin", "DigiByte", "BitcoinDark", "GameCredits", "GXShares", "Lykke", "Dogecoin", "Blocknet", "Syscoin", "Verge", "FirstCoin", "Nxt", "I-O Coin", "Ubiq", "Particl","NAV Coin", "Rise", "Vertcoin", "Bitdeal", "FairCoin", "Metaverse ETP", "Gulden", "ZCoin", "CloakCoin", "NoLimitCoin", "Elastic", "Peercoin", "Aidos Kuneen", "ReddCoin", "LEOcoin", "Counterparty", "MonaCoin", "DECENT", "The ChampCoin", "Viacoin", "Emercoin", "Crown", "Sprouts", "ION", "Namecoin", "Clams", "BitBay", "OKCash", "Unobtanium", "Diamond", "Skycoin", "MonetaryUnit", "SpreadCoin", "Mooncoin", "Expanse", "SIBCoin", "ZenCash", "PotCoin", "Radium", "Burst", "LBRY Credits", "Shift","DigitalNote", "Neblio", "Einsteinium", "Compcoin", "Omni", "ATC Coin", "Energycoin", "Rubycoin", "Gambit", "E-coin", "SaluS", "Groestlcoin", "BlackCoin", "Golos", "GridCoin"]


for crypto in cryptonames:
    dataset = preprocess_and_save_Data(crypto,dateFormat=True,save=False)
    del dataset['Date']
    vol_list = list(dataset['Volume'])
    market_list = list(dataset['Market Cap'])
    open_list = list(dataset['Open'])
    close_list = list(dataset['Close'])
    high_list = list(dataset['High'])
    low_list = list(dataset['Low'])

    volume_standard_input_list.append(vol_list)
    market_standard_input_list.append(market_list)
    open_standard_input_list.append(open_list)
    close_standard_input_list.append(close_list)
    high_standard_input_list.append(high_list)
    low_standard_input_list.append(low_list)


list_of_lists.append(volume_standard_input_list)
list_of_lists.append(market_standard_input_list)
list_of_lists.append(open_standard_input_list)
list_of_lists.append(close_standard_input_list)
list_of_lists.append(high_standard_input_list)
list_of_lists.append(low_standard_input_list)


pos = 0

names = ['volume', 'market_cap', 'open', 'close','high','low']

# ???????????????? final_dict?

for i,list_ in enumerate(list_of_lists):
    final_dict_ = compute_distance(pos, list_, final_dict, dim_red_flag=False)
    with open('similarities/data_'+names[i]+'.json', 'w') as f:
        json.dump(final_dict_,f)
