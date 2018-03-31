import re

filename = "2index.txt"
file = open(filename, "r")
for line in file:
	if "\t" in line:
		print re.split(r'\t+', line)[2]
		f = open('cities.txt', 'a')
		f.write(re.split(r'\t+', line)[2]+'\n')
