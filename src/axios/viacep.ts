export const getViaCepInfo = async (val: string) => {
  if (val.length === 8) {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${val}/json/`);
      const json = await res.json();
      if (json) {
        return {
          neighbor: json.bairro,
          city: json.localidade,
          complement: json.complemento,
          line1: json.logradouro,
          uf: json.uf,
          cep: val,
          address: `${json.logradouro}, ${json.bairro} ${json.complemento}, ${json.localidade} - ${json.uf}`,
        };
      }
    } catch (error) {}
  }
};
