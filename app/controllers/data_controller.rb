class DataController < ApplicationController
  def timeline
    id = params[:id]
    xml = SurfData.get_timeline(id)
    render :inline => xml.body
  end

  def bull_xml
    id = params[:id]
    xml = SurfData.get_bull_xml(id)
    render :inline => xml.body
  end

  def wave_map_times
    timezone = params[:timezone]
    map = params[:map]
    maptype = params[:maptype]
    xml = SurfData.get_wave_map_times(timezone, map, maptype)
    render :inline => xml.body
  end

  def wind_map_times
    timezone = params[:timezone]
    map = params[:map]
    xml = SurfData.get_wind_map_times(timezone, map)
    render :inline => xml.body
  end

  def pressure_map_times
    timezone = params[:timezone]
    map = params[:map]
    maptype = params[:maptype]
    xml = SurfData.get_pressure_map_times(timezone, map, maptype)
    render :inline => xml.body
  end

  def wave_maps_hierarchy
    xml = SurfData.get_wave_maps_hierarchy
    render :inline => xml.body
  end

  def period_maps_hierarchy
    xml = SurfData.get_period_maps_hierarchy
    render :inline => xml.body
  end

  def nearshorewind_maps_hierarchy
    xml = SurfData.get_nearshorewind_maps_hierarchy
    render :inline => xml.body
  end

  def pressure_maps_hierarchy
    xml = SurfData.get_pressure_maps_hierarchy
    render :inline => xml.body
  end
  
  def sst_maps_hierarchy
    xml = SurfData.get_sst_maps_hierarchy
    render :inline => xml.body
  end

  def buoy_maps
    xml = SurfData.get_buoy_maps
    render :inline => xml.body
  end

  def forecast_xy
    map = params[:map]
    xml = SurfData.get_forecast_xy(map)
    render :inline => xml.body
  end

  def buoy_data
    map = params[:map]
    timezone = params[:timezone]
    xml = SurfData.get_buoy_data(map, timezone)
    render :inline => xml.body
  end
end
