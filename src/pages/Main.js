import React, { useEffect, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import uuid from "uuid/v4";
import { format } from "date-fns";

const ADD_CATEGORY = gql`
  mutation MyMutation($objects: [categories_insert_input!]!) {
    insert_categories(objects: $objects) {
      affected_rows
    }
  }
`;

export default function Main({ client }) {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    id: uuid(),
    name: "",
    slug: "",
    created_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    updated_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
    deleted_at: null
  });
  const [addCategory, { data }] = useMutation(ADD_CATEGORY);

  useEffect(() => {
    async function load() {
      const response = await client.query({
        query: gql`
          {
            categories {
              id
              name
              slug
              created_at
              updated_at
              deleted_at
            }
          }
        `
      });

      setCategories(response.data.categories);
    }

    load();
  }, [client]);

  function handleSubmit(e) {
    e.preventDefault();

    addCategory({ variables: { objects: category } });

    setCategories([...categories, category]);
    setCategory({
      id: uuid(),
      name: "",
      slug: "",
      created_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      updated_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      deleted_at: null
    });
  }

  return (
    <div>
      <h2>Categorias</h2>
      <ul>
        {categories.map(({ id, name, slug, created_at }) => (
          <li key={id}>
            {name} - {slug} - {created_at}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={category.name}
          onChange={e => setCategory({ ...category, name: e.target.value })}
        />
        <input
          placeholder="Slug"
          value={category.slug}
          onChange={e => setCategory({ ...category, slug: e.target.value })}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
