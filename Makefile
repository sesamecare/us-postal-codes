# Download a list of US postal code data and build a sqlite3 db from it.
# This should be run periodically, but on the order of like a year, as things change VERY slowly.
uspostalcodes: assets/uspostalcodes.db

assets/uspostalcodes.db:
	mkdir -p assets
	rm -f assets/uspostalcodes.db
	curl -o temp_input.zip https://download.geonames.org/export/zip/US.zip
	unzip -p temp_input.zip US.txt | awk -F'\t' '{print $$2 "\t" $$3 "\t" $$5 "\t" $$10 "\t" $$11}' > temp_output.txt
	rm temp_input.zip
	sqlite3 assets/uspostalcodes.db "CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, postal_code TEXT, city TEXT, state TEXT, lat REAL, lng REAL);"
	awk -F'\t' '{ gsub(/'\''/, "'\'''\''", $$1); gsub(/'\''/, "'\'''\''", $$2); gsub(/'\''/, "'\'''\''", $$3); print "INSERT INTO locations (postal_code, city, state, lat, lng) VALUES ('\''"$$1"'\'', '\''"$$2"'\'', '\''"$$3"'\'', "$$4", "$$5");"}' temp_output.txt | sqlite3 assets/uspostalcodes.db
	sqlite3 assets/uspostalcodes.db "DELETE FROM locations WHERE state = '';"
	sqlite3 assets/uspostalcodes.db "CREATE INDEX idx_postal_code ON locations (postal_code);"
	rm temp_output.txt
