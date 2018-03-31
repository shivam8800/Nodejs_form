import re

filename = "0index.txt"
file = open(filename, "r")
for line in file:
	if "\t" in line:
		print re.split(r'\t+', line)[0]
		f = open('cities.txt', 'a')
		f.write(re.split(r'\t+', line)[0]+'\n')