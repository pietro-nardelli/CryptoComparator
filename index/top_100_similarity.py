'''
TODO:
    da dissimilarità a similarità (1-d)
    cross correlation anzichè distanza (nell'altro file)
    provare scala logaritmica
'''

import json
import csv
import random

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import manifold
from sklearn import preprocessing
from sklearn.decomposition import PCA


import numpy as np
from numpy import linalg

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
            link['value'] = link['value']/max
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

dim_reduction_alg = 'mds'

final_dict = import_data ('dataset/100List.csv')
nodes_id, pos, standard_input_list = dim_red_computation(final_dict, dim_reduction_alg=dim_reduction_alg)
plot_dim_red(nodes_id, pos)
final_dict = compute_distance(pos, standard_input_list, final_dict, dim_red_flag=True)


with open(dim_reduction_alg+'.json', 'w') as f:
    json.dump(final_dict,f)
