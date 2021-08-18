import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Message {
  id: string;
  userName: string;
  text: string;
}

let url = 'http://localhost:3001/todo-socket/';
if (process.env.NODE_ENV === 'production') {
  url = 'Add url here when the server is deployed.';
}

export const webSocket = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: url }),
  endpoints: builder => ({
    getMessages: builder.query<Message[], void>({
      query: () => 'messages',
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket('ws://localhost:3001');
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded;

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (!data) return;

            updateCachedData(draft => {
              draft.push(data);
            });
          };

          ws.addEventListener('message', listener);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved;
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close();
      }
    })
  })
});

export const { useGetMessagesQuery } = webSocket;
