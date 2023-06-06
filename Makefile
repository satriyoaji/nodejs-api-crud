
migrate:
	rm -rf build && yarn build && yarn typeorm migration:generate -d ./src/utils/data-source.ts

db-push:
	yarn build && yarn typeorm migrate:run -d src/utils/data-source.ts