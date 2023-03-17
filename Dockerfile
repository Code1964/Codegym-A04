# Use an official Python runtime as a parent image
FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install system packages
RUN apt-get update \
    && apt-get -y install locales sqlite3 nodejs npm \
    && localedef -f UTF-8 -i ja_JP ja_JP.UTF-8 \
    && echo 'alias tw="npx tailwindcss -i ./static/css/input.css -o ./static/dist/css/output.css --watch"' >> ~/.bashrc \
    && echo 'alias pm="python main.py"' >> ~/.bashrc

# Set environment variables
ENV PYTHONUNBUFFERED True
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8
ENV TERM xterm
ENV TZ Asia/Tokyo
ENV PORT 8080

# Upgrade pip and setuptools
RUN pip install --upgrade pip setuptools

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Tailwind CSS
# RUN npm install -D tailwindcss

# Expose port 8080 for the container
EXPOSE 8080

# Run the web service on container startup. Here we use the gunicorn
# webserver, with one worker process and 8 threads.
# For environments with multiple CPU cores, increase the number of workers
# to be equal to the cores available.
# Timeout is set to 0 to disable the timeouts of the workers to allow Cloud Run to handle instance scaling.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app
