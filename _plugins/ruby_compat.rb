unless Object.method_defined?(:tainted?)
  class Object
    def tainted?
      false
    end

    def taint
      self
    end

    def untaint
      self
    end

    def freeze
      self
    end unless method_defined?(:freeze)
  end
end
