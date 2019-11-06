FROM python:3.7.2-stretch

WORKDIR /var/www/
ADD . /var/www/

RUN pip3 install -r requirements.txt

EXPOSE 8080

CMD ["uwsgi", "app.ini"]
