# Fullstack Open - Blog List

## Running mongoDB in Podman 

```
podman run --name local-mongo -v $PWD/data:/data/db:Z -p 27017:27017 -d mongo
podman logs local-mongo
podman exec -it local-mongo bash
```

