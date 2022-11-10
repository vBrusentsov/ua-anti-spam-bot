FROM public.ecr.aws/f2g8j8i0/node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#RUN npm install
# If you are building your code for production
RUN npm i --only=production

# Bundle app source
COPY . .

CMD [ "npm", "run", "build" ]

CMD [ "npm", "run", "start:bot:prod" ]
