export const handleGetCep = async (e: any) => {
  let val = e.target.value;
  if (val.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${val}/json/`);
      const json = await res.json();
      if (json) {
      }
    } catch (error) {}
  }
};
