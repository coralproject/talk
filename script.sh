for i in {1..100}
do
  ./bin/cli -c .env users create --email "user-x${i}@coralproject.net" --password "mysecretpassword" --name "userxxx${i}" -f
done
