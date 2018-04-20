import re

filename = "language.txt"
file = open(filename, "r")
list_languages = []
for line in file:
	list_languages.append(line.rstrip())

print list_languages