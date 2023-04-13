import Card from "@/components/Card";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useState } from "react";

export async function getStaticProps() {
  const maxPokemons = 200;
  const api = "https://pokeapi.co/api/v2/pokemon/";

  const res = await fetch(`${api}/?limit=${maxPokemons}`);
  const data = await res.json();

  data.results.forEach((item, index) => {
    item.id = index + 1;
  });

  return {
    props: {
      pokemons: data.results,
    },
  };
}

export default function Home({ pokemons }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [visiblePokemons, setVisiblePokemons] = useState(12);
  const [sortOption, setSortOption] = useState("");

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    switch (sortOption) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "asc":
        return a.id - b.id;
      case "desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleLoadMore = () => {
    setVisiblePokemons(visiblePokemons + 12);
  };

  const handleSortOptionChange = (event) => {
    setSortOption(event.target.value);
  };

  return (
    <>
      <div className={styles.title_container}>
        <h1 className={styles.title}>
          Poke<span>dex</span>
        </h1>
        <Image
          src="/images/pokeballl.png"
          width="50"
          height="50"
          alt="Pokemon"
        />
      </div>
      <div className={styles.search_container}>
        <input
          className={styles["search-input"]}
          type="text"
          placeholder="Pesquisar por nome"
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      <div className={styles.sort_container}>
        <label>
          Ordenar por:
          <select value={sortOption} onChange={handleSortOptionChange}>
            <option value="">Selecione</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
            <option value="asc">Menor número</option>
            <option value="desc">Maior número</option>
          </select>
        </label>
      </div>
      <div className={styles.pokemon_container}>
        {filteredPokemons.slice(0, visiblePokemons).map((pokemon) => (
          <Card key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
      {visiblePokemons < filteredPokemons.length && (
        <div className={styles.load_more}>
          <button onClick={handleLoadMore}>Carregar mais</button>
        </div>
      )}
    </>
  );
}
