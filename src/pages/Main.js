import React, { useEffect, useState } from 'react'
import { gql } from 'apollo-boost'
import { useMutation } from '@apollo/react-hooks'
import uuid from 'uuid/v4'
import { format } from 'date-fns'

const ADD_CATEGORY = gql`
  mutation MyMutation($objects: [categories_insert_input!]!) {
    insert_categories(objects: $objects) {
      affected_rows
    }
  }
`

const UPD_CATEGORY = gql`
  mutation MyMutation($id: uuid, $objects: categories_set_input) {
    update_categories(_set: $objects, where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`

export default function Main({ client }) {
  const [categories, setCategories] = useState([])
  const [selected, setSelected] = useState(false)
  const [category, setCategory] = useState({
    id: uuid(),
    name: '',
    slug: '',
    created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    deleted_at: null
  })
  const [addCategory, { data }] = useMutation(ADD_CATEGORY)
  const [updCategory, { uData }] = useMutation(UPD_CATEGORY)

  useEffect(() => {
    async function load() {
      const response = await client.query({
        query: gql`
          {
            categories(where: { deleted_at: { _is_null: true } }) {
              id
              name
              slug
              created_at
              updated_at
              deleted_at
            }
          }
        `
      })

      setCategories(response.data.categories)
    }

    load()
  }, [client])

  function handleSubmit(e) {
    e.preventDefault()

    addCategory({ variables: { objects: category } })

    setCategories([...categories, category])
    setCategory({
      id: uuid(),
      name: '',
      slug: '',
      created_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
      deleted_at: null
    })
  }
  function handleSelect(category) {
    setSelected(true)
    setCategory(category)
  }

  function handleUpdate(e) {
    e.preventDefault()

    updCategory({
      variables: {
        id: category.id,
        objects: {
          name: category.name,
          slug: category.slug,
          updated_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
        }
      }
    })

    setCategories(categories.map(c => (c.id === category.id ? category : c)))
  }

  function handleDelete(id) {
    updCategory({
      variables: {
        id: id,
        objects: { deleted_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss') }
      }
    })

    setCategories(categories.filter(c => c.id !== id))
  }

  return (
    <div>
      <h2>Categorias</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            {cat.name} - {cat.slug} - {cat.created_at}
            <button onClick={() => handleSelect(cat)}>Atualizar</button>
            <button onClick={() => handleDelete(cat.id)}>Deletar</button>
          </li>
        ))}
      </ul>

      {!selected ? (
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
      ) : (
        <form onSubmit={handleUpdate}>
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
      )}
    </div>
  )
}
