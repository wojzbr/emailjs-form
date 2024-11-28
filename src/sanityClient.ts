import sanityClient from '@sanity/client';

const client = sanityClient({
  projectId: 'f9vbuz0k', // Replace with your Sanity project ID
  dataset: 'production',       // Replace with your dataset name
  apiVersion: 'v2022-03-07',    // Use the current date or the version you set in Sanity
  useCdn: true,                // `true` for production, `false` for fresh data
});

export default client;
