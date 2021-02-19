import json
import csv
import random

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import manifold
from sklearn import preprocessing
from sklearn.decomposition import PCA
from sklearn.utils.validation import check_symmetric
import math


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
def dim_red_computation (dictionary, dim_reduction_alg='PCA'):
    standard_input_list = []
    nodes_id = []

    for node in dictionary['nodes']:
        nodes_id.append(node['#'])

        node_values = []

        node_values.append(node['Market Cap'])
        #node_values.append(node['Price'])
        node_values.append(node['Circulating Supply'])
        #node_values.append(node['Volume (24h)'])
        node_values.append(node['% Change (24h)'])

        standard_input_list.append(node_values)

    #data standardization
    std_scale = preprocessing.StandardScaler().fit(standard_input_list)
    standard_input_list= std_scale.transform(standard_input_list)

    if (dim_reduction_alg == 'mds'):
        mds = manifold.MDS(n_components=2, dissimilarity="euclidean",random_state=13)
        pos = mds.fit(standard_input_list).embedding_
    elif (dim_reduction_alg == 'pca'):
        pca = PCA(n_components=2)
        pos = pca.fit_transform(standard_input_list)


    return nodes_id,pos,standard_input_list

def plot_dim_red(nodes_id, pos):
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
        variance_computation = []
        for link in final_dict['links']:
            link['value'] = 1 - link['value']/max
            variance_computation.append(link['value'])

        print ("Variance: ", variance(variance_computation))

    # Compute simple Euclidean distance
    else:
        max = 0
        for i in range(len(standard_input_list)):
            v_i = standard_input_list[i]
            for j in range(i, len(standard_input_list)):
                v_j = standard_input_list[j]
                val = np.linalg.norm(v_i - v_j)
                if (max < val):
                    max = val

                final_dict['links'].append( {"source": i, "target": j, "value": val} )
        # Normalization w.r.t. max
        for link in final_dict['links']:
            link['value'] = link['value']/max

    return final_dict


def variance(data):
     # Number of observations
     n = len(data)
     # Mean of the data
     mean = sum(data) / n
     # Square deviations
     deviations = [(x - mean) ** 2 for x in data]
     # Variance
     variance = sum(deviations) / n
     return variance


def my_corrcoef( x, y ):
    mean_x = np.mean( x )
    mean_y = np.mean( y )
    std_x  = np.std ( x )
    std_y  = np.std ( y )
    n      = len    ( x )
    return (( x - mean_x ) * ( y - mean_y )).sum() / n / ( std_x * std_y )


def compute_similarity_t0(standard_input_list, final_dict):
    final_dict['links'] = []
    # Compute simple Euclidean distance
    max = 0
    for i in range(len(standard_input_list)):
        v_i = standard_input_list[i]
        for j in range(i, len(standard_input_list)):
            v_j = standard_input_list[j]
            min_nums = min(len(v_i),len(v_j))
            val = my_corrcoef(v_i[:min_nums], v_j[:min_nums])
            #val = np.linalg.norm(np.asarray(v_i[:min_nums]) - np.asarray(v_j[:min_nums])) #[-1,1]
            val = ( val + 1 )/2 # Normalize between [0,1]
            if (max < val):
                max = val

            final_dict['links'].append( {"source": i, "target": j, "value": val} )
    # Normalization w.r.t. max
    for link in final_dict['links']:
        link['value'] = link['value']/max
    return final_dict



def compute_dissimilarity_t0_for_mds(standard_input_list):
    matrix = []
    max = 0
    for i in range(len(standard_input_list)):
        row = []
        v_i = standard_input_list[i]
        for j in range(len(standard_input_list)):
            v_j = standard_input_list[j]
            min_nums = min(len(v_i),len(v_j))
            val = my_corrcoef(v_i[:min_nums], v_j[:min_nums])
            #val = np.linalg.norm(np.asarray(v_i[:min_nums]) - np.asarray(v_j[:min_nums])) #[-1,1]
            val = ( val + 1 )/2 # Normalize between [0,1]
            val = round(val.astype(np.float64),1)
            if (max < val):
                max = val

            row.append(val)
        matrix.append(row)
    # Normalization w.r.t. max
    for r in range(len(matrix)):
        for c in range(len(matrix)):
            if ( r == c):
                matrix[r][c] = 0
            else:
                matrix[r][c] = 1 - matrix[r][c]/max
    matrix = np.array(matrix, dtype=np.float64)
    print (matrix)
    return matrix

# Preprocess data and compute MDS
def dim_red_computation_custom (matrix):
    #data standardization
    std_scale = preprocessing.StandardScaler().fit(matrix)
    matrix= std_scale.transform(matrix)

    matrix = check_symmetric(matrix, tol=1e-30)

    mds = manifold.MDS(n_components=2, dissimilarity='precomputed',random_state=13)
    pos = mds.fit(matrix).embedding_

    return pos


def index_of_first_of_the_year(date_input_list_of_cryptos):
    date_indexes_list = []
    for j in range(len(date_input_list_of_cryptos)):
        date_index = {'2017': 0, '2016': 0, '2015': 0}
        for i,d in enumerate(date_input_list_of_cryptos[j]):
            if (d[0:2]=='01' and d[3:5]=='01' and d[6:] == '2017' and date_index['2017']==0):
                date_index['2017'] = i
            elif (d[0:2]=='01' and d[3:5]=='01' and d[6:] == '2016' and date_index['2016']==0):
                date_index['2016'] = i
            elif (d[0:2]=='01' and d[3:5]=='01' and d[6:] == '2015' and date_index['2015']==0):
                date_index['2015'] = i
        date_indexes_list.append(date_index)
    return date_indexes_list

def compute_similarity_year(standard_input_list, final_dict, date_indexes_list, year):
    final_dict['links'] = []
    # Compute simple Euclidean distance
    max = 0

    for i in range(len(standard_input_list)):
        v_i = standard_input_list[i]

        for j in range(i, len(standard_input_list)):
            # 264 if year 2017
            # 630 if year 2016
            # 995 if year 2015
            # E.g. Crown crypto 925 if year 2015: some values are lost.

            if ( i == 57 ): print (date_indexes_list[j])
            if (date_indexes_list[i][year] == date_indexes_list[j][year] and date_indexes_list[i][year] != 0 and date_indexes_list[i][year] !=0):

                v_j = standard_input_list[j]
                if (year == '2017'):
                    # from 0 to the start of the year, but we need to include it with +1
                    # otherwise python indexing will discard it
                    min_index = 0
                    max_index = date_indexes_list[i][year]+1

                elif (year == '2016'):
                    # from the last day of 2016 to the first day of 2016
                    min_index = date_indexes_list[i]['2017']+1
                    max_index = date_indexes_list[i][year]+1

                else:
                    # from the last day of 2015 to the first day
                    min_index = date_indexes_list[i]['2016']+1
                    max_index = date_indexes_list[i][year]+1

                val = my_corrcoef(v_i[min_index:max_index], v_j[min_index:max_index])

                #val = np.linalg.norm(np.asarray(v_i[:min_nums]) - np.asarray(v_j[:min_nums])) #[-1,1]
                val = ( val + 1 )/2 # Normalize between [0,1]
                if ( math.isnan(val) ): val = -1
                if (max < val):
                    max = val
            else:
                if (i==j):
                    val = 1
                else:
                    val = -1

            final_dict['links'].append( {"source": i, "target": j, "value": val} )
    # Normalization w.r.t. max
    for link in final_dict['links']:
        link['value'] = link['value']/max
    return final_dict

final_dict = import_data ('dataset/100List.csv')

# ESEMPIO:
volume_standard_input_list=[]
market_standard_input_list=[]
high_standard_input_list=[]
low_standard_input_list=[]
open_standard_input_list=[]
close_standard_input_list=[]
date_input_list=[]

list_of_lists = []

cryptonames = ["Bitcoin", "Ethereum", "Bitcoin Cash", "Ripple", "Dash", "Litecoin", "NEM", "IOTA", "Monero", "Ethereum Classic", "NEO", "BitConnect", "Lisk", "Zcash", "Stratis", "Waves", "Ark","Steem", "Bytecoin", "Decred", "BitShares", "Stellar Lumens", "Hshare", "Komodo", "PIVX", "Factom", "Byteball Bytes", "Nexus", "Siacoin", "DigiByte", "BitcoinDark", "GameCredits", "GXShares", "Lykke", "Dogecoin", "Blocknet", "Syscoin", "Verge", "FirstCoin", "Nxt", "I-O Coin", "Ubiq", "Particl","NAV Coin", "Rise", "Vertcoin", "Bitdeal", "FairCoin", "Metaverse ETP", "Gulden", "ZCoin", "CloakCoin", "NoLimitCoin", "Elastic", "Peercoin", "Aidos Kuneen", "ReddCoin", "LEOcoin", "Counterparty", "MonaCoin", "DECENT", "The ChampCoin", "Viacoin", "Emercoin", "Crown", "Sprouts", "ION", "Namecoin", "Clams", "BitBay", "OKCash", "Unobtanium", "Diamond", "Skycoin", "MonetaryUnit", "SpreadCoin", "Mooncoin", "Expanse", "SIBCoin", "ZenCash", "PotCoin", "Radium", "Burst", "LBRY Credits", "Shift","DigitalNote", "Neblio", "Einsteinium", "Compcoin", "Omni", "ATC Coin", "Energycoin", "Rubycoin", "Gambit", "E-coin", "SaluS", "Groestlcoin", "BlackCoin", "Golos", "GridCoin"]


for crypto in cryptonames:
    dataset = preprocess_and_save_Data(crypto,dateFormat=True,save=False)
    #del dataset['Date']
    vol_list = list(dataset['Volume'])
    market_list = list(dataset['Market Cap'])
    open_list = list(dataset['Open'])
    close_list = list(dataset['Close'])
    high_list = list(dataset['High'])
    low_list = list(dataset['Low'])
    date_list = list(dataset['Date'])


    volume_standard_input_list.append(vol_list)
    market_standard_input_list.append(market_list)
    open_standard_input_list.append(open_list)
    close_standard_input_list.append(close_list)
    high_standard_input_list.append(high_list)
    low_standard_input_list.append(low_list)
    date_input_list.append(date_list)


list_of_lists.append(volume_standard_input_list)
list_of_lists.append(market_standard_input_list)
list_of_lists.append(open_standard_input_list)
list_of_lists.append(close_standard_input_list)
list_of_lists.append(high_standard_input_list)
list_of_lists.append(low_standard_input_list)


names = ['volume', 'market_cap', 'open', 'close','high','low']
years = ['2017', '2016', '2015']


date_indexes_list = index_of_first_of_the_year (date_input_list)



# dissimilarity matrix for volume
matrix = compute_dissimilarity_t0_for_mds(list_of_lists[0])
#print (matrix)
pos_custom = dim_red_computation_custom(matrix)

# MDS COMPUTATION PART: used to compute nodes_id only
dim_reduction_alg = 'mds'
nodes_id, pos, standard_input_list = dim_red_computation(final_dict, dim_reduction_alg=dim_reduction_alg)
final_dict = compute_distance(pos, standard_input_list, final_dict, dim_red_flag=True)
#########

#plot_dim_red(nodes_id, pos)
plot_dim_red(nodes_id, pos_custom)

pos_dict = {} # {}
for i,node in enumerate(final_dict['nodes']):
    pos_dict[i] = [pos_custom[i][0], pos_custom[i][1]]

with open('positions.json', 'w') as f:
    json.dump(pos_dict,f)



final_dict_ = compute_similarity_year(list_of_lists[1], final_dict, date_indexes_list, "2016")

for i,list_ in enumerate(list_of_lists):
    final_dict_ = compute_similarity_t0(list_, final_dict)
    with open('similarities/data_'+names[i]+'.json', 'w') as f:
        json.dump(final_dict_,f)


for i,list_ in enumerate(list_of_lists):
    for year in years:
        final_dict_ = compute_similarity_year(list_, final_dict, date_indexes_list, year)
        with open('similarities/data_'+names[i]+'_'+year+'.json', 'w') as f:
            json.dump(final_dict_,f)

#final_dict_ = compute_similarity_year(list_of_lists[3], final_dict, date_indexes_list, '2015')
