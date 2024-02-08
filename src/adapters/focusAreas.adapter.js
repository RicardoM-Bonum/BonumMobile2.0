const focusAreasAdapter = areas => {
  return areas?.map(area => ({
    focusArea: area.focusArea,
    statusArea: area.statusArea,
    createdAt: area.createdAt,
    updatedAt: area.updatedAt,
    urlImgFocusArea: area.urlImgFocusArea,
    id: area._id,
    image: area.urlImgFocusArea,
    value: area._id,
    name: area.focusArea,
  }));
};

export default focusAreasAdapter;
