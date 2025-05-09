function updatePointData(points, updatedPointData) {
  return points.map((point) => point.id === updatedPointData.id ? updatedPointData : point);
}

export { updatePointData };
