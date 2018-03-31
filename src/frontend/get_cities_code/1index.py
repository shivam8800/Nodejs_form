import re

filename = "1index.txt"
file = open(filename, "r")
counter = 0
for line in file:
	if "\t" in line:
		print re.split(r'\t+', line)[1]
		f = open('cities.txt', 'a')
		f.write(re.split(r'\t+', line)[1]+'\n')
	# if counter == 5:
	# 	f = open('cities.txt', 'a')
	# 	f.write(line)
	# 	counter = 0
	# else:
	# 	counter = counter +1