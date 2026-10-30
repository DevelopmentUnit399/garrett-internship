import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const AuthorContext = createContext(null);

const AuthorAPI = ({ children }) => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchAuthor = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors",
          { params: { author: authorId } }
        );
        if (active) setAuthor(response.data);
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAuthor();

    return () => {
      active = false;
    };
  }, [authorId]);

  return (
    <AuthorContext.Provider value={{ author, loading, error }}>
      {children}
    </AuthorContext.Provider>
  );
};

export const useAuthor = () => {
  const context = useContext(AuthorContext);
  if (!context) {
    throw new Error("useAuthor must be used within an AuthorAPI provider");
  }
  return context;
};

export default AuthorAPI;
