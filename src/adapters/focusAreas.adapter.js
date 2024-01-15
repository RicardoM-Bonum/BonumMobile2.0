const focusAreasAdapter = data => {
  const areas = data.data;

  return areas?.data.map(area => ({
    focusArea: area.focusArea,
    statusArea: area.statusArea,
    createdAt: area.createdAt,
    updatedAt: area.updatedAt,
    urlImgFocusArea: area.urlImgFocusArea,
    id: area._id
  }));
};

export default focusAreasAdapter;
