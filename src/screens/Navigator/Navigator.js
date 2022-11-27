import React, { useEffect, useState } from "react";

export default function Navigator({ route, navigation }) {
  const single_id = route.params.id;
  useEffect(() => {
    navigation.navigate("Single order", { id: single_id });
  }, []);
}
