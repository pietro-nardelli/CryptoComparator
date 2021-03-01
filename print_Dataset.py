import pandas as pd
import numpy as np
keyword = "Bitcoin"
path = 'dataset/'+str(keyword)+'.csv'

dataset = pd.read_csv(path)

print(dataset.head(5))