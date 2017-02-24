class Xps < Controller
  map '/xp'

  layout :default
  set_layout nil => [ :ajax_load, :questionnaire ]

  before :start do
    if !logged_in?
      if request.xhr?
        respond!({message: "Vous devez être connecté pour participer aux expériences."}.to_json, 401, 'Content-Type' => 'application/json')
      else
        flash[:warning] = "Vous devez être connecté pour participer aux expériences."
        redirect Xps.r(:index)
      end
    end
    @section = "xp"
  end

  def index
    @xps = Xp.all
    @title = "Expérience"
  end

  def start(id)
    @xp = Xp[id]
    if @xp.nil?
      flash[:warning] = 'Expérience inexistante'
      redirect MainController.r(:index)
    else
      @title = @xp.name
      @xp_desc = File.read("./view/xp/" + xp_file_name() + "_desc.xhtml")
    end
  end

  def xp_file_name
    @xp.name.gsub(/\s+/, "_").downcase
  end

  # Dynamically load the view for the experiment
  def ajax_load(id)
    @xp = Xp[id]
    if !@xp.nil?
      view_sym = xp_file_name().to_sym
      render_view view_sym
    end
  end

  #Save experiments results
  def send_results(id)
    results = request.params["results"]
    if logged_in? and !results.nil? and !Xp[id].nil?
      res = UserXp.create do |r|
        r.user_id = user['id']
        r.xp_id = id
        r.xp_time = Time.now
        r.music = request.params["music"]
        r.drug = request.params["drug"]
        r.concentration_level = request.params["concentration_level"]
        r.results = results
        r.alone = request.params["alone"]
        r.rng_id = request.params["rng_id"]
      end
    end
  end

  def end_xp_problem
    Ramaze::Log.error("Someone has finish the experiments but had problems with the rng")
  end
end